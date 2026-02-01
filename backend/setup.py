"""
Setup configuration for NudgeSafe Hands Backend.

Allows installation as a Python package:
    pip install -e .
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

# Read requirements
requirements = (this_directory / "requirements.txt").read_text(encoding='utf-8').splitlines()

setup(
    name="nudgesafe-backend",
    version="1.0.0",
    description="NudgeSafe Hands - Backend Python pour intégration SafetyGraph Core",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Preventera Inc. / AgenticX5 Ecosystem",
    author_email="support@preventera.ca",
    url="https://github.com/Preventera/NudgeSafe-Hands",
    license="MIT",
    
    # Package configuration
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    
    # Dependencies
    install_requires=requirements,
    
    # Python version
    python_requires=">=3.9",
    
    # Classifiers
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Healthcare Industry",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    
    # Keywords
    keywords=[
        "safety", "hse", "behavioral-ai", "nudge-theory", "neo4j",
        "workplace-safety", "hand-injuries", "prevention", "safetygraph"
    ],
    
    # Entry points (CLI scripts)
    entry_points={
        "console_scripts": [
            "nudgesafe-demo=demo:main",
        ],
    },
    
    # Include additional files
    include_package_data=True,
    
    # Test suite
    test_suite="tests",
    
    # Extras
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-cov>=4.1.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.7.0",
            "isort>=5.12.0",
            "mypy>=1.5.0",
            "flake8>=6.1.0",
        ],
        "api": [
            "fastapi>=0.103.0",
            "uvicorn[standard]>=0.23.0",
        ],
    },
)
