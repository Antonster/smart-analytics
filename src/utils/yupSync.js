const yupSync = (yupSchema) => ({
  async validator({ field }, value) {
    await yupSchema.validateSyncAt(field, { [field]: value });
  },
});

export default yupSync;
