import Icon, { IconType } from "./Icon";
const ServerIcon = ({ name, symbol }: { name: string; symbol: string }) => {
  return <Icon type={IconType.TEXT} title={name} text={symbol} />;
};

export default ServerIcon;
