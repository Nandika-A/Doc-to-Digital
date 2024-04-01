from django.shortcuts import render
import os
import subprocess


def get_llm_output():   	
    #get the llm output here
    output="hello"
    audio_path=text_to_speech(output)
    context={"output":output, "audio_path":audio_path, "lip_sync_path":get_lip_sync(audio_path)}
    print(context)
    return context

def text_to_speech(text):
    #save audio in media/audio folder
    return "media/audio/hello.wav"
    
def get_lip_sync(audio_path):
    audio_base_name = os.path.basename(audio_path)
    json_base_name = os.path.splitext(audio_base_name)[0] + ".json"
    json_path = os.path.join("static/lip-synch/", json_base_name)
    print(json_path)
    command = ["Rhubarb-Lip-Sync-1.13.0-Linux/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb" , "-f", "json",audio_path, "-o", json_path]
    command_line = ' '.join(command)
    subprocess.run(command_line, check=True,shell=True)
    return json_path
get_llm_output()
