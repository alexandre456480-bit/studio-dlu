import re

def add_dimensions(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find img tags without width/height
    def replace_img(match):
        tag = match.group(0)
        # Skip if width or height is already present
        if ' width=' in tag or ' height=' in tag:
            return tag
            
        # Give generic width/height depending on context. Logo is small.
        if 'logo' in tag.lower():
            tag = tag.replace('<img ', '<img width="150" height="50" ')
        else:
            tag = tag.replace('<img ', '<img width="800" height="600" ')
            
        # Ensure loading="lazy" is there if it's not the logo
        if 'logo' not in tag.lower() and 'loading=' not in tag:
            tag = tag.replace('<img ', '<img loading="lazy" ')
            
        return tag

    new_content = re.sub(r'<img[^>]+>', replace_img, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

for file in ['index.html', 'sobre.html', 'tratamentos.html', 'resultados.html']:
    add_dimensions(file)
    print(f"Processed {file}")
