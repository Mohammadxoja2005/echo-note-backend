import whisper
import sys

model = whisper.load_model("tiny")  # or "base.en" for faster English-only
result = model.transcribe(sys.argv[1])
print(result["text"])
