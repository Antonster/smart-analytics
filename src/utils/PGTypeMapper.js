const PGTypeMapper = (PGType) => {
  if (
    [
      'smallint',
      'integer',
      'bigint',
      'decimal',
      'numeric',
      'real',
      'double precision',
      'smallserial',
      'serial',
      'bigserial',
      'money',
    ].includes(PGType)
  ) {
    return 'number';
  }

  if (['boolean'].includes(PGType)) {
    return 'boolean';
  }

  if (['character varying', 'varchar', 'character', 'char', 'text'].includes(PGType)) {
    return 'string';
  }

  if (['timestamp', 'date', 'time'].includes(PGType)) {
    // what?
    return '';
  }

  if (['bytea'].includes(PGType)) {
    // TODO: this needs to be treated differently, maybe hidden?
    return 'number';
  }

  return 'no mapping';
};

export default PGTypeMapper;
