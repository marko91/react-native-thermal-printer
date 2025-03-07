import { NativeModules } from 'react-native';

type BluetoothPrinter = {
  deviceName: string;
  macAddress: string;
};

type NativeModuleType = typeof NativeModules & {
  ThermalPrinterModule: {
    printTcp(
      ip: string,
      port: number,
      payload: string,
      autoCut: boolean,
      openCashbox: boolean,
      mmFeedPaper: number,
      printerDpi: number,
      printerWidthMM: number,
      printerNbrCharactersPerLine: number,
      timeout: number,
      charsetEncoding: string
    ): Promise<void>;
    printBluetooth(
      macAddress: string,
      payload: string,
      autoCut: boolean,
      openCashbox: boolean,
      mmFeedPaper: number,
      printerDpi: number,
      printerWidthMM: number,
      printerNbrCharactersPerLine: number,
      charsetEncoding: string
    ): Promise<void>;
    getBluetoothDeviceList(): Promise<BluetoothPrinter[]>;
  };
};

const { ThermalPrinterModule }: NativeModuleType =
  NativeModules as NativeModuleType;

interface PrinterInterface {
  payload: string;
  autoCut: boolean;
  openCashbox: boolean;
  mmFeedPaper: number;
  printerDpi: number;
  printerWidthMM: number;
  printerNbrCharactersPerLine: number;
  charsetEncoding: string;
}

interface PrintTcpInterface extends PrinterInterface {
  ip: string;
  port: number;
  timeout: number;
}

interface PrintBluetoothInterface extends PrinterInterface {
  macAddress: string;
}

let defaultConfig: PrintTcpInterface & PrintBluetoothInterface = {
  macAddress: '',
  ip: '192.168.192.168',
  port: 9100,
  payload: '',
  autoCut: true,
  openCashbox: false,
  mmFeedPaper: 20,
  printerDpi: 203,
  printerWidthMM: 80,
  printerNbrCharactersPerLine: 42,
  timeout: 30000,
  charsetEncoding: "windows-1250"
};

const getConfig = (
  args: Partial<typeof defaultConfig>
): typeof defaultConfig => {
  return Object.assign({}, defaultConfig, args);
};

const printTcp = async (
  args: Partial<PrintTcpInterface> & Pick<PrinterInterface, 'payload'>
): Promise<void> => {
  const {
    ip,
    port,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine,
    timeout,
    charsetEncoding
  } = getConfig(args);

  await ThermalPrinterModule.printTcp(
    ip,
    port,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine,
    timeout,
    charsetEncoding
  );
};

const printBluetooth = (
  args: Partial<PrintBluetoothInterface> & Pick<PrinterInterface, 'payload'>
): Promise<void> => {
  const {
    macAddress,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine,
    charsetEncoding
  } = getConfig(args);

  return ThermalPrinterModule.printBluetooth(
    macAddress,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine,
    charsetEncoding
  );
};

const getBluetoothDeviceList = (): Promise<BluetoothPrinter[]> => {
  return ThermalPrinterModule.getBluetoothDeviceList();
};

export default {
  printTcp,
  printBluetooth,
  defaultConfig,
  getBluetoothDeviceList,
};
