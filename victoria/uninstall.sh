sudo systemctl stop polluvic.service
sudo systemctl disable polluvic.service
sudo rm /etc/systemd/system/polluvic.service
sudo systemctl daemon-reload