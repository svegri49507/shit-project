const pictures = await Promise.all(
  keys.map(async (key) => {
    let my_file = await s3
      .getObject({
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: key,
      })
      .promise();
    return {
      src: Buffer.from(my_file.Body).toString("base64"),
      name: key.split("/").pop(),
    };
  })
);
