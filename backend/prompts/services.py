import google.generativeai as genai
from django.conf import settings
from .models import Prompt
import logging

# Configure Gemini
if hasattr(settings, 'GEMINI_API_KEY'):
    genai.configure(api_key=settings.GEMINI_API_KEY)

logger = logging.getLogger(__name__)


def generate_prompt_template(user, category, input_text, style, description=None):
    """Generate a prompt template based on user profile and inputs"""
    
    templates = {
        'doubt': f"""
As an AI assistant helping {user.username} (a {user.role}), please provide a {style} answer to the following question:

Question: {input_text}

{f"Additional context: {description}" if description else ""}

Please ensure your response is {style} and tailored to someone with a {user.role} background.
        """.strip(),
        
        'image_generation': f"""
Create a {style} image generation prompt based on the following request from {user.username} (a {user.role}):

Request: {input_text}

{f"Additional requirements: {description}" if description else ""}

Generate a detailed prompt that includes:
- Visual style and composition
- Lighting and atmosphere
- Color palette suggestions
- Technical specifications
- Art style references

Make it suitable for AI image generation tools and {style} in nature.
        """.strip(),
        
        'learning_roadmap': f"""
Create a {style} learning roadmap for {user.username} (a {user.role}) on the following topic:

Topic: {input_text}

{f"Learning goals: {description}" if description else ""}

Please provide:
- Learning objectives
- Step-by-step progression
- Recommended resources
- Time estimates
- Milestone assessments
- Practical projects

Tailor the roadmap to a {user.role} background and make it {style}.
        """.strip(),
        
        'video_generation': f"""
Develop a {style} video concept and script for {user.username} (a {user.role}) based on:

Video idea: {input_text}

{f"Additional requirements: {description}" if description else ""}

Please include:
- Video concept overview
- Target audience
- Script outline
- Visual suggestions
- Pacing and structure
- Call-to-action

Make it engaging and {style}, suitable for a {user.role}'s perspective.
        """.strip(),
        
        'deep_research': f"""
Conduct a {style} research analysis for {user.username} (a {user.role}) on:

Research topic: {input_text}

{f"Research focus: {description}" if description else ""}

Please provide:
- Research methodology
- Key findings and insights
- Data analysis
- Supporting evidence
- Conclusions and implications
- Further research suggestions

Present the research in a {style} manner appropriate for a {user.role}.
        """.strip(),
        
        'idea_exploration': f"""
Explore and expand on the following idea for {user.username} (a {user.role}):

Initial idea: {input_text}

{f"Exploration direction: {description}" if description else ""}

Please provide:
- Concept expansion
- Creative variations
- Implementation possibilities
- Potential challenges
- Market opportunities
- Next steps

Make the exploration {style} and relevant to a {user.role}'s perspective.
        """.strip(),
    }
    
    return templates.get(category, templates['doubt'])


def execute_gemini_request(prompt_text):
    """Execute a request to Gemini API"""
    
    if not hasattr(settings, 'GEMINI_API_KEY') or not settings.GEMINI_API_KEY:
        raise ValueError("Gemini API key not configured")
    
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content
        response = model.generate_content(
            prompt_text,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=2000,
                temperature=0.7,
            )
        )
        
        return response.text.strip()
    
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        raise Exception(f"Gemini API error: {str(e)}")


def execute_prompt_only(user, data):
    """Execute a prompt with Gemini without saving to database"""
    
    # Generate the prompt template
    generated_prompt = generate_prompt_template(
        user=user,
        category=data['category'],
        input_text=data['input_text'],
        style=data['response_style'],
        description=data.get('description', '')
    )
    
    # Execute the prompt with Gemini
    ai_response = execute_gemini_request(generated_prompt)
    
    return {
        'generated_prompt': generated_prompt,
        'ai_response': ai_response
    }


def create_and_execute_prompt(user, data):
    """Create a prompt and execute it with Gemini"""
    
    # Generate the prompt template
    generated_prompt = generate_prompt_template(
        user=user,
        category=data['category'],
        input_text=data['input_text'],
        style=data['response_style'],
        description=data.get('description', '')
    )
    
    # Execute the prompt with Gemini
    ai_response = execute_gemini_request(generated_prompt)
    
    # Create or update the prompt
    if 'prompt_id' in data and data['prompt_id']:
        prompt = Prompt.objects.get(id=data['prompt_id'], user=user)
        prompt.input_text = data['input_text']
        prompt.category = data['category']
        prompt.response_style = data['response_style']
        prompt.description = data.get('description', '')
        prompt.generated_prompt = generated_prompt
        prompt.ai_response = ai_response
        prompt.save()
    else:
        # Create a new prompt
        title = data.get('title', f"{data['category'].replace('_', ' ').title()} - {data['input_text'][:50]}")
        prompt = Prompt.objects.create(
            user=user,
            title=title,
            input_text=data['input_text'],
            category=data['category'],
            response_style=data['response_style'],
            description=data.get('description', ''),
            generated_prompt=generated_prompt,
            ai_response=ai_response
        )
    
    return prompt, ai_response
