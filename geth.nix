{
  imports = [ <nixpkgs/nixos/modules/virtualisation/amazon-image.nix> ];
  ec2.hvm = true;

  users = {
    extraUsers.geth = {
      uid = 1000;
      home = "/var/lib/geth";
      createHome = true;
      group = "geth";
    };

    extraGroups.geth = {
      gid = 1000;
    };
  };

  systemd.services.geth = {
    description = "Go ethereum daemon";
    after = [ "network.target" "local-fs.target" "remote-fs.target" ];
    wantedBy = [ "multi-user.target" ];
    serviceConfig = {
      ExecStart = ''/nix/store/9nbi8l9yjrvwg7i7wi3skzwplyw15xxi-go-ethereum-1.8.6/bin/geth \
        --rinkeby --syncmode fast \
        --cache 128 --password /dev/null --nousb \
        --rpc --rpcaddr 127.0.0.1 --rpcapi eth,shh,web3,net,personal --rpcvhosts rinkeby.demo.oax.org --rpccorsdomain '*' \
        --wsapi shh,personal,net,eth --ws --wsaddr 127.0.0.1 --wsorigins '*' \
        --shh
      '';
      User = "geth";
      RestartSec = "30s";
      Restart = "always";
      StartLimitInterval = "1m";
      PrivateTmp = true;
      ProtectHome = true;
    };
  };

  networking.firewall = {
    allowedUDPPorts = [
      30303
      30301
    ];

    allowedTCPPorts = [
      80
      443
      30303
    ];
  };

  # Source: https://nixos.wiki/wiki/Nginx
  services.nginx = {
    enable = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;

    virtualHosts."rinkeby.demo.oax.org" = {
      enableACME = true;
      forceSSL = true;
      locations."/".proxyPass = "http://localhost:8545";
    };
  };

  # Optional: You can configure the email address used with Let's Encrypt.
  # This way you get renewal reminders (automated by NixOS) as well as expiration emails.
  security.acme.certs = {
    "rinkeby.demo.oax.org".email = "tamas.herman@enuma.io";
  };
}
