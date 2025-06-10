import re

def remove_comments(text):
    text = re.sub(r'//.*', '', text)
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    return text

text = """

"""
print(remove_comments(text))
