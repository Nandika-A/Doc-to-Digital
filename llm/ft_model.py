# -*- coding: utf-8 -*-
"""Ft_model.ipynb

Download the Base model from huggigface:

    git lfs install
    git clone https://huggingface.co/microsoft/phi-2

    
Change the model_name to the downloaded location.

Download the fine-tuned Checkpoints from:

    https://drive.google.com/file/d/1Yx0wgjE9DeKG1tnmDpd1k9WkH94pSH9t/view?usp=sharing
"""



import os

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from tqdm import tqdm
os.environ['WANDB_DISABLED']="true"

base_model_id = "microsoft/phi-2"
device_maps = {'':'cpu'}
model_name = "C:\\Users\\Acer\\Downloads\\phi-2"

base_model = AutoModelForCausalLM.from_pretrained(model_name,torch_dtype=torch.bfloat16)

tokenizer = AutoTokenizer.from_pretrained(model_name,trust_remote_code=True,padding_side="left",add_eos_token=True,add_bos_token=True,use_fast=False)
tokenizer.pad_token = tokenizer.eos_token

eval_tokenizer = AutoTokenizer.from_pretrained(model_name, add_bos_token=True, trust_remote_code=True, use_fast=False)
eval_tokenizer.pad_token = eval_tokenizer.eos_token

def gen(model,p, maxlen=100, sample=True):
    toks = eval_tokenizer(p, return_tensors="pt")
    toks = toks.to('cpu')
    res = model.generate(**toks, max_new_tokens=maxlen, do_sample=sample,num_return_sequences=1,temperature=0.1,num_beams=1,top_p=0.95,).to('cpu')
    return eval_tokenizer.batch_decode(res,skip_special_tokens=True)

# #download the model: https://drive.google.com/file/d/1Yx0wgjE9DeKG1tnmDpd1k9WkH94pSH9t/view?usp=sharing
# #!unzip "/content/model.zip"

from peft import PeftModel

ft_model = PeftModel.from_pretrained(base_model, "C:\\Users\\Acer\\Downloads\\ft_model\\model\\final-checkpoint\\checkpoint-1000",torch_dtype=torch.float16,is_trainable=False)

def response(dialogue):
  prompt = f"Instruct: Explain the following conversation as a Teacher.\n{dialogue}\nOutput:\n"

  peft_model_res = gen(ft_model,prompt,25)
  peft_model_output = peft_model_res[0].split('Output:\n')[1]
  prefix, success, result = peft_model_output.partition('\n')


  return peft_model_res

# call the response function

# import time
# st = time.time()

# res = response("What is Science?.")

# ed = time.time()

# print("Time Taken: ", ed - st)

# res = response("What is Science?.")
# prefix, success, result = res[0].split('Output:\n')[1].partition('\n')

# print(prefix)

