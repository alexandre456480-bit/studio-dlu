import re

def optimize_css(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace transition: all with explicit properties
        content = re.sub(r'transition:\s*all\s*(.*?);', r'transition: opacity \1, transform \1, background-color \1, box-shadow \1;', content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Optimized {file_path}")
    except FileNotFoundError:
        print(f"File {file_path} not found.")

def optimize_js(file_path):
    pass # Adicione otimizações específicas de JS aqui se necessário

optimize_css('assets/css/style.css')
optimize_css('assets/css/pages.css')
