export type IpAddressPresentationState =
  | "hidden"
  | "revealed"
  | "unavailable";

export interface IpAddressPresentation {
  state: IpAddressPresentationState;
  displayText: string;
  accessibleText: string;
}

export const MASKED_IP_ADDRESS = "••••••••";

export function primaryIpAddressPresentation(
  primaryIpAddress: string | null,
  revealed: boolean,
): IpAddressPresentation {
  if (primaryIpAddress === null) {
    return {
      state: "unavailable",
      displayText: "Unavailable",
      accessibleText: "IP address unavailable",
    };
  }

  if (!revealed) {
    return {
      state: "hidden",
      displayText: MASKED_IP_ADDRESS,
      accessibleText: "IP address hidden",
    };
  }

  return {
    state: "revealed",
    displayText: primaryIpAddress,
    accessibleText: `IP address ${primaryIpAddress}`,
  };
}
