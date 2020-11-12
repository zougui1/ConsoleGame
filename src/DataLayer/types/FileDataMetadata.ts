interface IMetadata {
  id: number;
  file: string;
}

export type FileDataMetadata = IMetadata | IMetadata[];
