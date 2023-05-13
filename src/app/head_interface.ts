// block-data.interface.ts

export interface BlockData {
  header: Header;
  validator_set: ValidatorSet;
  commit: Commit;
  dah: Dah;
}

export interface Header {
  version: Version;
  chain_id: string;
  height: string;
  time: string;
  last_block_id: LastBlockId;
  last_commit_hash: string;
  data_hash: string;
  validators_hash: string;
  next_validators_hash: string;
  consensus_hash: string;
  app_hash: string;
  last_results_hash: string;
  evidence_hash: string;
  proposer_address: string;
}

export interface Version {
  block: string;
  app: string;
}

export interface LastBlockId {
  hash: string;
  parts: Parts;
}

export interface Parts {
  total: number;
  hash: string;
}

export interface ValidatorSet {
  validators: Validator[];
  proposer: Validator;
}

export interface Validator {
  address: string;
  pub_key: PubKey;
  voting_power: string;
  proposer_priority: string;
}

export interface PubKey {
  type: string;
  value: string;
}

export interface Commit {
  height: number;
  round: number;
  block_id: BlockId;
  signatures: Signature[];
}

export interface BlockId {
  hash: string;
  parts: Parts;
}

export interface Signature {
  block_id_flag: number;
  validator_address: string;
  timestamp: string;
  signature: string;
}

export interface Dah {
  row_roots: string[];
  column_roots: string[];
}

export interface JsonResponse {
  id: number;
  jsonrpc: string;
  result: {
    catch_up_done: boolean;
    concurrency: number;
    head_of_catchup: number;
    head_of_sampled_chain: number;
    is_running: boolean;
    network_head_height: number;
  };
}

export interface SpeedInfo {
  download: string;
  upload: string;
}

export interface LocationInfo {
  AS: string;
  City: string;
  CountryCode: string;
  Country: string;
  ISP: string;
  Latitude: number;
  Longitude: number;
  Organization: string;
  Query: string;
  RegionName: string;
  Region: string;
  Status: string;
  Timezone: string;
  ZIP: string;
}
