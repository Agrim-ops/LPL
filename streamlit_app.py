"""
Drive Shield — Retrofit Driver-Assistance Kit Concept
Streamlit Cloud Entry Point

Team 6, Learners' Premier League (LPL 2026-27), NIIT University
College Project Concept (Design and Simulation Stage)
"""

import os
import streamlit as st
import streamlit.components.v1 as components

# Configure Streamlit page
st.set_page_config(
    page_title="Drive Shield — Retrofit Driver-Assistance Kit Concept",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom styling to make the HUD marketing site and simulation feel native and full-screen
st.markdown("""
<style>
    /* Hide Streamlit default chrome */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Remove padding around main container */
    .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
    }
    
    /* Dark background matching Drive Shield tokens */
    .stApp {
        background-color: #060A12;
    }
    
    iframe {
        border: none !important;
        width: 100% !important;
    }
</style>
""", unsafe_allow_html=True)

# Path to the standalone self-contained HTML
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STANDALONE_HTML_PATH = os.path.join(BASE_DIR, "site", "standalone.html")
INDEX_HTML_PATH = os.path.join(BASE_DIR, "site", "index.html")

html_content = ""
if os.path.exists(STANDALONE_HTML_PATH):
    with open(STANDALONE_HTML_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()
elif os.path.exists(INDEX_HTML_PATH):
    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()
else:
    st.error("Site files not found. Please ensure the /site directory is present.")

if html_content:
    # Render the full marketing site and interactive simulation
    if hasattr(st, "iframe"):
        try:
            st.iframe(html_content, height=1050, scrolling=True)
        except Exception:
            components.html(html_content, height=1050, scrolling=True)
    else:
        components.html(html_content, height=1050, scrolling=True)
