/**
 * Hardware wallets supported by MetaMask.
 */
export enum HardwareKeyringType {
  ledger = 'Ledger Hardware',
  trezor = 'Trezor Hardware',
  lattice = 'Lattice Hardware',
  qr = 'QR Hardware Wallet Device',
}

/**
 * These are the keyrings that are managed entirely by MetaMask.
 */
export enum InternalKeyringType {
  hdKeyTree = 'HD Key Tree',
  imported = 'Simple Key Pair',
}

/**
 * All keyrings supported by MetaMask.
 */
export const KeyringType = {
  ...HardwareKeyringType,
  ...InternalKeyringType,
};
