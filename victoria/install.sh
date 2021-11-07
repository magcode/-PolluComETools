cd PolluComETools/victoria
gcc pollucom.c -o pollucom

npm install

home=`pwd`
user=`whoami`
pname="polluvic"

__service="
[Unit]
Description=Pollucom VictoriaMetrics Gateway
After=network.target
[Service]
ExecStart=node $home/$pname.js
WorkingDirectory=$home
SyslogIdentifier=$pname
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$user
[Install]
WantedBy=multi-user.target
"

echo "$__service" | sudo tee /etc/systemd/system/$pname.service
sudo systemctl daemon-reload
sudo systemctl enable $pname.service

echo "Done. Configure in config/default.json and start with 'sudo service $pname start' afterwards."