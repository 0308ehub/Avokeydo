import re
from collections import Counter

# Path to the keystrokes file (adjust as needed)
KEYSTROKES_FILE = "keystrokes.txt"

def load_keystroke_data(file_path):
    """Load keystroke data from the file."""
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
        return [line.strip() for line in lines]
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []

def process_keystrokes(data):
    """Process keystrokes to calculate typing metrics."""
    keys = []
    messages = []
    sentences = []
    current_message = ""
    current_sentence = ""

    for entry in data:
        # Extract the key pressed (assuming format: "timestamp - Key pressed: X")
        match = re.search(r"Key pressed: (.+)", entry)
        if not match:
            continue
        key = match.group(1)

        keys.append(key)

        # Track messages (before Enter key)
        if key == "Enter":
            if current_message:
                messages.append(current_message.strip())
                current_message = ""
        else:
            current_message += key

        # Track sentences (before period)
        if key == ".":
            if current_sentence:
                sentences.append(current_sentence.strip())
                current_sentence = ""
        else:
            current_sentence += key

    # Add any unfinished messages or sentences
    if current_message:
        messages.append(current_message.strip())
    if current_sentence:
        sentences.append(current_sentence.strip())

    return keys, messages, sentences

def analyze_typing_habits(keys, messages, sentences):
    """Analyze typing habits and generate a report."""
    total_keys = len(keys)
    key_counts = Counter(keys)
    favorite_key = key_counts.most_common(1)[0] if key_counts else ("None", 0)

    avg_message_length = sum(len(msg) for msg in messages) / len(messages) if messages else 0
    avg_sentence_length = sum(len(sent) for sent in sentences) / len(sentences) if sentences else 0

    # Additional quirks
    total_words = sum(len(msg.split()) for msg in messages)
    avg_words_per_message = total_words / len(messages) if messages else 0

    caps_lock_usage = key_counts.get("CapsLock", 0)
    space_usage = key_counts.get(" ", 0)

    return {
        "total_keys": total_keys,
        "favorite_key": favorite_key,
        "avg_message_length": avg_message_length,
        "avg_sentence_length": avg_sentence_length,
        "total_words": total_words,
        "avg_words_per_message": avg_words_per_message,
        "caps_lock_usage": caps_lock_usage,
        "space_usage": space_usage,
    }

def print_report(report):
    """Print a summary of the typing habits report."""
    print("\nTyping Habits Report:")
    print(f"Total keys pressed: {report['total_keys']}")
    print(f"Favorite key: '{report['favorite_key'][0]}' (pressed {report['favorite_key'][1]} times)")
    print(f"Average message length (before Enter): {report['avg_message_length']:.2f} characters")
    print(f"Average sentence length (before period): {report['avg_sentence_length']:.2f} characters")
    print(f"Total words typed: {report['total_words']}")
    print(f"Average words per message: {report['avg_words_per_message']:.2f}")
    print(f"Caps Lock usage: {report['caps_lock_usage']} times")
    print(f"Space key usage: {report['space_usage']} times")

def main():
    print("Analyzing keystroke data...")
    data = load_keystroke_data(KEYSTROKES_FILE)

    if not data:
        print("No data to analyze. Exiting.")
        return

    keys, messages, sentences = process_keystrokes(data)
    report = analyze_typing_habits(keys, messages, sentences)
    print_report(report)

if __name__ == "__main__":
    main()
