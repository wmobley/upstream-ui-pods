export type MetadataSchemaScope = 'campaign' | 'station' | 'sensor' | string;

export type MetadataJsonValue =
  | string
  | number
  | boolean
  | null
  | MetadataJsonValue[]
  | { [key: string]: MetadataJsonValue };

export type MetadataSchemaItem = {
  id: number;
  scope: MetadataSchemaScope;
  key: string;
  label: string;
  field_type: string;
  required: boolean;
  help_text?: string | null;
  units?: string | null;
  ckan_field?: string | null;
  ckan_mode?: string | null;
  order_index?: number;
  active?: boolean;
  options?: Record<string, MetadataJsonValue> | MetadataJsonValue[] | null;
};

export type MetadataSchemaListResponse = {
  items: MetadataSchemaItem[];
};
