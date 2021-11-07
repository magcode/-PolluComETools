gcc pollucom.c -o pollucom
cd victoria
npm install

home=`pwd`
user=`whoami`

__service="
[Unit]
Description=Pollucom VictoriaMetrics Gateway
After=network.target
[Service]
ExecStart=node $home/polluvic.js
WorkingDirectory=$home
SyslogIdentifier=polluvic
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$user
[Install]
WantedBy=multi-user.target
"

echo "$__service" | sudo tee /etc/systemd/system/polluvic.service
sudo systemctl daemon-reload
sudo systemctl enable polluvic.service

echo "Done. Configure in config/default.json and start with 'sudo service polluvic start' afterwards."