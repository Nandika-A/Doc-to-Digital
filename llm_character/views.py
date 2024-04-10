from django.shortcuts import render
import os
import subprocess
#from main.views import text_to_speech

def display_page(request):
    return render(request, 'pirate.html')

def get_llm_output(text):   	
    #get the llm output here also get animation number
    output="hello"
    audio_path=text_to_speech(output)
    lip_sync_path=get_lip_sync(audio_path)
    animation_no=get_animation_no()
    return output,audio_path,lip_sync_path,animation_no

def text_to_speech(text):
    #save audio in media/audio folder

    return "static/audio/hello.wav"
    
def get_lip_sync(audio_path):
    audio_base_name = os.path.basename(audio_path)
    audio_new_path=os.path.join("pirate/",audio_path )
    json_base_name = os.path.splitext(audio_base_name)[0] + ".json"
    json_path = os.path.join("pirate/static/lip-synch/", json_base_name)
    print(json_path)
    command = ["Rhubarb-Lip-Sync-1.13.0-Linux/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb" , "-f", "json",audio_new_path, "-o", json_path]
    command_line = ' '.join(command)
    subprocess.run(command_line, check=True,shell=True)

    return os.path.join("static/lip-synch/", json_base_name)

def get_animation_no():
    return 3

#get_llm_output()
