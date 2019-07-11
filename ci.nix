{
  imports = [ <nixpkgs/nixos/modules/virtualisation/amazon-image.nix> ];
  ec2.hvm = true;

  services.gitlab-runner.enable = true;
  services.gitlab-runner.configFile = "/etc/gitlab-runner/config.toml";
  virtualisation.docker.enable = true;
}
