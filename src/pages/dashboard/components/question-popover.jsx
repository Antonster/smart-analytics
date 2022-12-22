import { Button, Form, Input, Popover } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { yupSync } from 'src/utils';
import * as yup from 'yup';

const yupSchema = yup.object().shape({
  name: yup.string().required('Please enter a unique name for this question'),
});

const antSchema = yupSync(yupSchema);

const QuestionPopover = ({
  formId,
  buttonText,
  open,
  onSubmit,
  onOpenChange,
  resetAfterSubmit,
}) => {
  const nameRef = useRef(null);
  const [form] = Form.useForm();
  const activeDatasource = useSelector((state) => state?.data?.activeDatasource);

  const onFinish = useCallback(
    (value) => {
      onSubmit(value);

      if (resetAfterSubmit) {
        form.resetFields();
      }
    },
    [form, onSubmit, resetAfterSubmit],
  );

  useEffect(() => {
    if (open)
      nameRef.current.focus({
        cursor: 'end',
      });
  }, [open]);

  return (
    <Popover
      trigger="click"
      placement="right"
      open={open}
      onOpenChange={onOpenChange}
      content={
        <Form name={formId} form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item label="Name" name="name" rules={[antSchema]}>
            <Input ref={nameRef} />
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
      {activeDatasource ? <Button type="dashed">Ask question</Button> : ''}
    </Popover>
  );
};

QuestionPopover.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  resetAfterSubmit: PropTypes.bool,
};

export default QuestionPopover;
