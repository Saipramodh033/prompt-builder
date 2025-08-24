"""
Google OAuth authentication views
"""
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Authenticate user with Google OAuth
    Expects: { "id_token": "google_id_token" }
    """
    try:
        id_token = request.data.get('id_token')
        
        if not id_token:
            return Response(
                {'error': 'ID token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the ID token with Google
        google_response = requests.get(
            f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
        )
        
        if google_response.status_code != 200:
            return Response(
                {'error': 'Invalid ID token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        google_data = google_response.json()
        
        # Verify the audience (client ID)
        if google_data.get('aud') != settings.GOOGLE_OAUTH_CLIENT_ID:
            return Response(
                {'error': 'Invalid token audience'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract user information
        email = google_data.get('email')
        first_name = google_data.get('given_name', '')
        last_name = google_data.get('family_name', '')
        google_id = google_data.get('sub')  # 'sub' is the Google user ID
        picture = google_data.get('picture', '')
        
        if not email:
            return Response(
                {'error': 'Email not provided by Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extract username from email (part before @)
        username = email.split('@')[0]
        
        # Ensure username is unique
        original_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{original_username}{counter}"
            counter += 1

        # Check if user exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
                'role': '',  # Empty role for new users - they'll select it in frontend
                'preferences': {
                    'google_id': google_id,
                    'profile_picture': picture,
                    'auth_provider': 'google'
                }
            }
        )

        # Update user info if they already exist
        if not created:
            user.first_name = first_name
            user.last_name = last_name
            if user.preferences:
                user.preferences.update({
                    'google_id': google_id,
                    'profile_picture': picture,
                    'auth_provider': 'google'
                })
            else:
                user.preferences = {
                    'google_id': google_id,
                    'profile_picture': picture,
                    'auth_provider': 'google'
                }
            user.save()

        # Generate JWT tokens
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'preferences': user.preferences,
            },
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_code(request):
    """
    Authenticate user with Google OAuth using authorization code
    Expects: { "code": "authorization_code" }
    """
    try:
        auth_code = request.data.get('code')
        
        if not auth_code:
            return Response(
                {'error': 'Authorization code is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Exchange authorization code for access token
        token_data = {
            'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
            'client_secret': settings.GOOGLE_OAUTH_CLIENT_SECRET,
            'code': auth_code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:3000/auth/google/callback',  # Must match Google Console
        }
        
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data=token_data
        )
        
        if token_response.status_code != 200:
            return Response(
                {'error': 'Failed to exchange authorization code'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token_json = token_response.json()
        access_token = token_json.get('access_token')
        
        if not access_token:
            return Response(
                {'error': 'No access token received'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Now use the access token to get user info (reuse the logic from google_auth)
        request.data = {'access_token': access_token}
        return google_auth(request)

    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
