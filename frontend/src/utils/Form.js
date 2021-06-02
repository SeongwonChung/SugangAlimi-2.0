export const singleFormData = (key, data) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  let formData = new FormData();

  formData.append(key, data);

  return {
    formData,
    config,
  };
};

export const multiFormData = (data_arr) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  let formData = new FormData();

  data_arr.map((data) => {
    formData.append(data.key, data.content);
  });

  // console.log(data_arr);

  return { formData, config };
};
