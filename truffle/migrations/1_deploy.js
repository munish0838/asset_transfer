const asset = artifacts.require("Asset_transfer");

module.exports = function (deployer) {
  deployer.deploy(asset,"Teoken", "TKN", "0x6c00000000000000000000000000000000000000000000000000000000000000");
};
