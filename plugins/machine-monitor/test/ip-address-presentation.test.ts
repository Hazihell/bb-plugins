import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MASKED_IP_ADDRESS,
  primaryIpAddressPresentation,
} from "../lib/ip-address-presentation.ts";

describe("Host Monitor IP address presentation", () => {
  it("does not expose a masked address in any presentation field", () => {
    const address = "192.0.2.42";
    const presentation = primaryIpAddressPresentation(address, false);

    assert.deepEqual(presentation, {
      state: "hidden",
      displayText: MASKED_IP_ADDRESS,
      accessibleText: "IP address hidden",
    });
    assert.equal(JSON.stringify(presentation).includes(address), false);
  });

  it("reveals the exact address only after an explicit request", () => {
    assert.deepEqual(primaryIpAddressPresentation("2001:db8::42", true), {
      state: "revealed",
      displayText: "2001:db8::42",
      accessibleText: "IP address 2001:db8::42",
    });
  });

  it("reports unavailable without inventing or revealing an address", () => {
    const unavailable = {
      state: "unavailable",
      displayText: "Unavailable",
      accessibleText: "IP address unavailable",
    } as const;

    assert.deepEqual(primaryIpAddressPresentation(null, false), unavailable);
    assert.deepEqual(primaryIpAddressPresentation(null, true), unavailable);
  });
});
