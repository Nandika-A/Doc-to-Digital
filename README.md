# hack36
Set up vitual env:
python3 -m venv myworld
source myworld/bin/activate

install the requirements using:
pip install -r requirements.txt

How to run program:
chmod +x run.sh
./run.sh

Installed new dependencies ? then do:
pip freeze > requirements.txt

Made any changes to javascript files?do:
npm run dev 

to use rhubarb:
sudo chmod +x rhubarb
../../Rhubarb-Lip-Sync-1.13.0-Linux/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb -f json media/audio/santa.wav -o static/lip-sync/santa.json