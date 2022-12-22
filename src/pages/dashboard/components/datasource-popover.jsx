import { Button, Form, Input, Popover } from 'antd';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { yupSync } from 'src/utils';
import * as yup from 'yup';

const yupSchema = yup.object().shape({
  name: yup.string().required('Please enter a unique name for this datasource'),
  host: yup.string().required('Please input the address of the DB server'),
  port: yup.string().required('Please input the DB port'),
  db_name: yup.string().required('Please input the DB name'),
  username: yup.string().required('Please input the DB username'),
  password: yup.string().required('Please input the DB password'),
});

const antSchema = yupSync(yupSchema);

const DatasourcePopover = ({
  formId,
  onSubmit,
  open,
  onOpenChange,
  resetAfterSubmit,
  buttonText,
  initialValues = {},
  children,
}) => {
  const [form] = Form.useForm();

  const onFinish = useCallback(
    (value) => {
      onSubmit(value);

      if (resetAfterSubmit) {
        form.resetFields();
      }
    },
    [form, onSubmit, resetAfterSubmit],
  );

  return (
    <Popover
      trigger="click"
      placement="right"
      open={open}
      onOpenChange={onOpenChange}
      content={
        <Form
          form={form}
          name={formId}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={initialValues}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Name" name="name" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="DB host" name="host" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="Port" name="port" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="DB name" name="db_name" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="username" name="username" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="DB password" name="password" rules={[antSchema]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
      }
    >
      {children}
    </Popover>
  );
};

DatasourcePopover.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  resetAfterSubmit: PropTypes.bool,
  buttonText: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    db_name: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DatasourcePopover;
