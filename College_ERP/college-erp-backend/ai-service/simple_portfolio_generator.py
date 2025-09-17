import asyncio
import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Any

class SimplePortfolioGenerator:
    def __init__(self):
        self.is_initialized = True  # Always ready since we're using template-based generation
        
        # Portfolio templates
        self.templates = {
            "professional": self._get_professional_template(),
            "creative": self._get_creative_template(),
            "academic": self._get_academic_template(),
            "modern": self._get_modern_template()
        }
        
        print("Simple portfolio generator initialized successfully!")
    
    def is_ready(self) -> bool:
        """Check if the generator is ready"""
        return self.is_initialized
    
    async def generate_portfolio(self, student_record: Any, template_style: str = "professional") -> Dict[str, Any]:
        """Generate a complete portfolio for a student"""
        
        # Extract student data
        student_data = self._extract_student_data(student_record)
        
        # Generate enhanced content using templates
        enhanced_content = await self._generate_enhanced_content(student_data)
        
        # Get template
        template = self.templates.get(template_style, self.templates["professional"])
        
        # Generate portfolio HTML
        portfolio_html = self._generate_portfolio_html(student_data, enhanced_content, template)
        
        # Generate summary and highlights
        summary = self._generate_summary(student_data, enhanced_content)
        highlights = self._extract_highlights(student_data, enhanced_content)
        
        return {
            "portfolio_html": portfolio_html,
            "summary": summary,
            "highlights": highlights
        }
    
    def _extract_student_data(self, student_record: Any) -> Dict[str, Any]:
        """Extract and organize student data"""
        return {
            "id": student_record.student_id,
            "name": student_record.name,
            "course": student_record.course,
            "semester": student_record.semester,
            "grades": student_record.grades,
            "projects": student_record.projects or [],
            "achievements": student_record.achievements or [],
            "skills": student_record.skills or [],
            "extracurricular": student_record.extracurricular or []
        }
    
    async def _generate_enhanced_content(self, student_data: Dict[str, Any]) -> Dict[str, str]:
        """Generate enhanced content for various sections using templates"""
        enhanced_content = {}
        
        # Generate professional summary
        enhanced_content["professional_summary"] = self._generate_professional_summary(student_data)
        
        # Generate project descriptions
        enhanced_content["project_descriptions"] = self._generate_project_descriptions(student_data["projects"])
        
        # Generate achievement descriptions
        enhanced_content["achievement_descriptions"] = self._generate_achievement_descriptions(student_data["achievements"])
        
        # Generate skills section
        enhanced_content["skills_description"] = self._generate_skills_description(student_data["skills"])
        
        return enhanced_content
    
    def _generate_professional_summary(self, student_data: Dict[str, Any]) -> str:
        """Generate a professional summary using templates"""
        name = student_data['name']
        course = student_data['course']
        semester = student_data['semester']
        skills = student_data['skills'][:3]  # Top 3 skills
        achievements = student_data['achievements'][:2]  # Top 2 achievements
        
        # Create a comprehensive summary
        summary_parts = []
        
        # Basic introduction
        summary_parts.append(f"I am {name}, a dedicated {course} student currently in semester {semester}.")
        
        # Skills highlight
        if skills:
            summary_parts.append(f"I have developed expertise in {', '.join(skills)}, which I have applied through various academic and personal projects.")
        
        # Achievement highlight
        if achievements:
            summary_parts.append(f"My academic journey has been marked by notable achievements including {achievements[0]}.")
        
        # Future aspirations
        if "Computer Science" in course or "Software" in course:
            summary_parts.append("I am passionate about technology innovation and aspire to contribute to cutting-edge software development projects.")
        elif "Mechanical" in course:
            summary_parts.append("I am enthusiastic about mechanical design and engineering solutions that can make a real-world impact.")
        elif "Electronics" in course or "Electrical" in course:
            summary_parts.append("I am committed to advancing in the field of electronics and electrical engineering, focusing on emerging technologies.")
        else:
            summary_parts.append("I am committed to applying my technical knowledge to solve real-world challenges and contribute to technological advancement.")
        
        return " ".join(summary_parts)
    
    def _generate_project_descriptions(self, projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate enhanced project descriptions"""
        enhanced_projects = []
        
        for project in projects:
            enhanced_project = project.copy()
            title = project.get('title', 'Project')
            description = project.get('description', 'No description available')
            technologies = project.get('technologies', [])
            
            # Enhance description with more professional language
            enhanced_description = self._enhance_project_description(title, description, technologies)
            enhanced_project["enhanced_description"] = enhanced_description
            enhanced_projects.append(enhanced_project)
        
        return enhanced_projects
    
    def _enhance_project_description(self, title: str, description: str, technologies: List[str]) -> str:
        """Enhance a project description with professional language"""
        if not description or description.lower() == 'no description available':
            # Generate a basic description based on title and technologies
            if technologies:
                return f"Developed {title} utilizing {', '.join(technologies[:3])}. This project demonstrates practical application of modern development practices and technical skills."
            else:
                return f"Successfully completed {title}, showcasing problem-solving abilities and technical expertise in the relevant domain."
        
        # Enhance existing description
        enhanced = description
        
        # Add technology context if not mentioned
        if technologies and not any(tech.lower() in description.lower() for tech in technologies):
            enhanced += f" The project was developed using {', '.join(technologies[:3])}, demonstrating proficiency in modern development tools and frameworks."
        
        return enhanced
    
    def _generate_achievement_descriptions(self, achievements: List[str]) -> List[Dict[str, str]]:
        """Generate enhanced achievement descriptions"""
        enhanced_achievements = []
        
        achievement_contexts = {
            "dean": "academic excellence and consistent high performance",
            "award": "outstanding project work and innovation",
            "competition": "problem-solving skills and competitive excellence",
            "hackathon": "collaborative development and creative thinking",
            "scholarship": "academic merit and dedication to studies",
            "internship": "practical application of skills in professional environment",
            "certification": "commitment to continuous learning and skill development"
        }
        
        for achievement in achievements:
            enhanced_achievement = {
                "title": achievement,
                "description": self._enhance_achievement_description(achievement, achievement_contexts)
            }
            enhanced_achievements.append(enhanced_achievement)
        
        return enhanced_achievements
    
    def _enhance_achievement_description(self, achievement: str, contexts: Dict[str, str]) -> str:
        """Enhance an achievement description"""
        achievement_lower = achievement.lower()
        
        # Find relevant context
        context = "recognition of dedication and outstanding performance"
        for key, desc in contexts.items():
            if key in achievement_lower:
                context = desc
                break
        
        return f"{achievement} - This recognition reflects my {context} and commitment to excellence in academic and extracurricular pursuits."
    
    def _generate_skills_description(self, skills: List[str]) -> str:
        """Generate a skills section description"""
        if not skills:
            return "Developing various technical and soft skills through academic coursework and practical projects."
        
        skill_categories = {
            "programming": ["Python", "Java", "JavaScript", "C++", "C#", "PHP", "Ruby"],
            "web": ["HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express"],
            "database": ["MySQL", "MongoDB", "PostgreSQL", "SQLite", "Redis"],
            "tools": ["Git", "Docker", "AWS", "Azure", "Linux", "Kubernetes"],
            "design": ["Photoshop", "Illustrator", "Figma", "Sketch", "AutoCAD"]
        }
        
        categorized_skills = {category: [] for category in skill_categories}
        other_skills = []
        
        for skill in skills:
            categorized = False
            for category, category_skills in skill_categories.items():
                if any(cat_skill.lower() in skill.lower() for cat_skill in category_skills):
                    categorized_skills[category].append(skill)
                    categorized = True
                    break
            if not categorized:
                other_skills.append(skill)
        
        description_parts = []
        
        if categorized_skills["programming"]:
            description_parts.append(f"Proficient in programming languages including {', '.join(categorized_skills['programming'][:3])}")
        
        if categorized_skills["web"]:
            description_parts.append(f"experienced in web technologies such as {', '.join(categorized_skills['web'][:3])}")
        
        if categorized_skills["database"]:
            description_parts.append(f"skilled in database management with {', '.join(categorized_skills['database'][:2])}")
        
        if other_skills:
            description_parts.append(f"knowledgeable in {', '.join(other_skills[:3])}")
        
        if description_parts:
            return f"I am {', and '.join(description_parts)}. These technical competencies are complemented by strong analytical thinking, problem-solving abilities, and a commitment to continuous learning."
        else:
            return f"Proficient in {', '.join(skills[:5])}{'and other relevant technologies' if len(skills) > 5 else ''}. Continuously expanding skill set through hands-on projects and coursework."
    
    def _generate_portfolio_html(self, student_data: Dict[str, Any], enhanced_content: Dict[str, str], template: Dict[str, str]) -> str:
        """Generate the complete portfolio HTML"""
        
        # Replace placeholders in template
        html = template["html"]
        css = template["css"]
        
        # Basic information
        html = html.replace("{{STUDENT_NAME}}", student_data["name"])
        html = html.replace("{{COURSE}}", student_data["course"])
        html = html.replace("{{SEMESTER}}", f"Semester {student_data['semester']}")
        html = html.replace("{{PROFESSIONAL_SUMMARY}}", enhanced_content.get("professional_summary", ""))
        
        # Skills section
        skills_html = ""
        for skill in student_data["skills"]:
            skills_html += f'<span class="skill-tag">{skill}</span>'
        html = html.replace("{{SKILLS}}", skills_html)
        
        # Projects section
        projects_html = ""
        for project in enhanced_content.get("project_descriptions", []):
            project_html = f"""
            <div class="project-item">
                <h3>{project.get('title', 'Project')}</h3>
                <p>{project.get('enhanced_description', '')}</p>
                <div class="project-tech">
                    {' '.join([f'<span class="tech-tag">{tech}</span>' for tech in project.get('technologies', [])])}
                </div>
            </div>
            """
            projects_html += project_html
        html = html.replace("{{PROJECTS}}", projects_html)
        
        # Achievements section
        achievements_html = ""
        for achievement in enhanced_content.get("achievement_descriptions", []):
            achievement_html = f"""
            <div class="achievement-item">
                <h4>{achievement['title']}</h4>
                <p>{achievement['description']}</p>
            </div>
            """
            achievements_html += achievement_html
        html = html.replace("{{ACHIEVEMENTS}}", achievements_html)
        
        # Grades section
        grades_html = ""
        for subject, grade in student_data["grades"].items():
            grades_html += f"""
            <div class="grade-item">
                <span class="subject">{subject}</span>
                <span class="grade">{grade}</span>
            </div>
            """
        html = html.replace("{{GRADES}}", grades_html)
        
        # Combine CSS and HTML
        complete_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{student_data['name']} - Portfolio</title>
    <style>
    {css}
    </style>
</head>
<body>
    {html}
</body>
</html>
        """
        
        return complete_html
    
    def _generate_summary(self, student_data: Dict[str, Any], enhanced_content: Dict[str, str]) -> str:
        """Generate a portfolio summary"""
        name = student_data["name"]
        course = student_data["course"]
        projects_count = len(student_data["projects"])
        achievements_count = len(student_data["achievements"])
        skills_count = len(student_data["skills"])
        
        summary = f"{name} is a dedicated {course} student with {projects_count} completed projects, "
        summary += f"{achievements_count} notable achievements, and expertise in {skills_count} technical skills. "
        summary += "This portfolio showcases their academic journey, technical capabilities, and professional growth, "
        summary += "demonstrating readiness for industry challenges and continued learning."
        
        return summary
    
    def _extract_highlights(self, student_data: Dict[str, Any], enhanced_content: Dict[str, str]) -> List[str]:
        """Extract key highlights from the student record"""
        highlights = []
        
        # Top skills
        if student_data["skills"]:
            top_skills = student_data["skills"][:3]
            highlights.append(f"Skilled in {', '.join(top_skills)}")
        
        # Project highlights
        if student_data["projects"]:
            project_count = len(student_data["projects"])
            if project_count == 1:
                highlights.append("Completed 1 technical project")
            else:
                highlights.append(f"Completed {project_count} technical projects")
        
        # Achievement highlights
        if student_data["achievements"]:
            achievement_count = len(student_data["achievements"])
            if achievement_count == 1:
                highlights.append("Earned 1 notable achievement")
            else:
                highlights.append(f"Earned {achievement_count} notable achievements")
        
        # Academic performance
        if student_data["grades"]:
            try:
                # Calculate average grade (simplified)
                grade_values = []
                for grade in student_data["grades"].values():
                    grade_str = str(grade).upper()
                    if 'A' in grade_str:
                        if '+' in grade_str:
                            grade_values.append(95)
                        elif '-' in grade_str:
                            grade_values.append(85)
                        else:
                            grade_values.append(90)
                    elif 'B' in grade_str:
                        if '+' in grade_str:
                            grade_values.append(85)
                        elif '-' in grade_str:
                            grade_values.append(75)
                        else:
                            grade_values.append(80)
                    elif 'C' in grade_str:
                        grade_values.append(70)
                    elif grade_str.replace('%', '').replace('.', '').isdigit():
                        grade_values.append(float(grade_str.replace('%', '')))
                
                if grade_values:
                    avg_grade = sum(grade_values) / len(grade_values)
                    if avg_grade >= 90:
                        highlights.append("Excellent academic performance (A grade average)")
                    elif avg_grade >= 80:
                        highlights.append("Strong academic performance (B+ grade average)")
                    elif avg_grade >= 70:
                        highlights.append("Good academic performance")
            except:
                highlights.append("Consistent academic performance")
        
        # Course and semester
        highlights.append(f"Currently pursuing {student_data['course']} - Semester {student_data['semester']}")
        
        return highlights[:5]  # Return top 5 highlights
    
    def _get_professional_template(self) -> Dict[str, str]:
        """Professional portfolio template"""
        return {
            "html": """
            <div class="portfolio-container">
                <header class="header">
                    <h1>{{STUDENT_NAME}}</h1>
                    <h2>{{COURSE}}</h2>
                    <p class="semester">{{SEMESTER}}</p>
                </header>
                
                <section class="summary">
                    <h2>Professional Summary</h2>
                    <p>{{PROFESSIONAL_SUMMARY}}</p>
                </section>
                
                <section class="skills">
                    <h2>Technical Skills</h2>
                    <div class="skills-container">
                        {{SKILLS}}
                    </div>
                </section>
                
                <section class="projects">
                    <h2>Projects</h2>
                    <div class="projects-container">
                        {{PROJECTS}}
                    </div>
                </section>
                
                <section class="achievements">
                    <h2>Achievements</h2>
                    <div class="achievements-container">
                        {{ACHIEVEMENTS}}
                    </div>
                </section>
                
                <section class="grades">
                    <h2>Academic Performance</h2>
                    <div class="grades-container">
                        {{GRADES}}
                    </div>
                </section>
            </div>
            """,
            "css": """
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background: #f4f4f4;
            }
            
            .portfolio-container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2c3e50;
                padding-bottom: 20px;
            }
            
            .header h1 {
                font-size: 2.5em;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            
            .header h2 {
                font-size: 1.3em;
                color: #34495e;
                font-weight: normal;
            }
            
            .semester {
                color: #7f8c8d;
                font-style: italic;
            }
            
            section {
                margin-bottom: 30px;
            }
            
            section h2 {
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            
            .skill-tag {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 5px 12px;
                margin: 5px;
                border-radius: 20px;
                font-size: 0.9em;
            }
            
            .project-item {
                background: #f8f9fa;
                padding: 20px;
                margin-bottom: 20px;
                border-left: 4px solid #3498db;
            }
            
            .project-item h3 {
                color: #2c3e50;
                margin-bottom: 10px;
            }
            
            .tech-tag {
                display: inline-block;
                background: #95a5a6;
                color: white;
                padding: 3px 8px;
                margin: 2px;
                border-radius: 12px;
                font-size: 0.8em;
            }
            
            .achievement-item {
                margin-bottom: 15px;
            }
            
            .achievement-item h4 {
                color: #27ae60;
                margin-bottom: 5px;
            }
            
            .grade-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin-bottom: 5px;
                background: #f8f9fa;
                border-radius: 5px;
            }
            
            .subject {
                font-weight: bold;
            }
            
            .grade {
                color: #27ae60;
                font-weight: bold;
            }
            """
        }
    
    def _get_creative_template(self) -> Dict[str, str]:
        """Creative portfolio template with vibrant colors"""
        return {
            "html": self._get_professional_template()["html"],
            "css": """
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            
            .portfolio-container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                box-shadow: 0 0 30px rgba(0,0,0,0.2);
                border-radius: 15px;
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 30px;
                border-radius: 15px;
            }
            
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            
            section h2 {
                color: #ff6b6b;
                border-bottom: 3px solid #4ecdc4;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            
            .skill-tag {
                background: linear-gradient(45deg, #ff6b6b, #ffa726);
                color: white;
                padding: 8px 15px;
                margin: 5px;
                border-radius: 25px;
                display: inline-block;
            }
            
            .project-item {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 20%);
                color: white;
                padding: 25px;
                margin-bottom: 20px;
                border-radius: 15px;
            }
            """
        }
    
    def _get_academic_template(self) -> Dict[str, str]:
        """Academic-focused template"""
        return {
            "html": self._get_professional_template()["html"],
            "css": self._get_professional_template()["css"].replace("#3498db", "#8e44ad").replace("#2c3e50", "#2c3e50")
        }
    
    def _get_modern_template(self) -> Dict[str, str]:
        """Modern minimalist template"""
        return {
            "html": self._get_professional_template()["html"],
            "css": """
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #444;
                background: #fafafa;
            }
            
            .portfolio-container {
                max-width: 900px;
                margin: 0 auto;
                background: white;
                padding: 60px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            .header {
                text-align: left;
                margin-bottom: 50px;
                border-left: 5px solid #000;
                padding-left: 20px;
            }
            
            .header h1 {
                font-size: 3em;
                color: #000;
                font-weight: 300;
            }
            
            section h2 {
                color: #000;
                font-weight: 300;
                font-size: 1.8em;
                margin-bottom: 25px;
                letter-spacing: 1px;
            }
            
            .skill-tag {
                background: #000;
                color: white;
                padding: 8px 16px;
                margin: 8px 8px 8px 0;
                font-size: 0.9em;
                display: inline-block;
            }
            """
        }