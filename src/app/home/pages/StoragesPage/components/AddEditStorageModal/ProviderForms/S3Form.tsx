import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Form,
  FormGroup,
  Checkbox,
  Flex,
  FlexModifiers,
} from '@patternfly/react-core';
import KeyDisplayIcon from '../../../../../../common/components/KeyDisplayIcon';
import HideWrapper from '../../../../../../common/components/HideWrapper';
import {
  AddEditMode,
  addEditStatusText,
  addEditButtonText,
  isAddEditButtonDisabled,
  isCheckConnectionButtonDisabled,
} from '../../../../../../common/add_edit_state';
import ConnectionStatusLabel from '../../../../../../common/components/ConnectionStatusLabel';
import CertificateUpload from '../../../../../../common/components/CertificateUpload';
import { withFormik, FormikProps } from 'formik';
import utils from '../../../../../../common/duck/utils';
import storageUtils from '../../../../../../storage/duck/utils';
import commonUtils from '../../../../../../common/duck/utils';

interface IFormValues {
  name: string;
  awsBucketName: string;
  awsBucketRegion: string;
  accessKey: string;
  secret: string;
  s3Url: string;
  bslProvider: string;
  requireSSL: boolean;
  caBundle: string;
}
interface IOtherProps {
  onAddEditSubmit: any;
  onClose: any;
  addEditStatus: any;
  initialStorageValues: any;
  checkConnection: (name) => void;
  provider: string;
  isAWS: boolean;
}

const componentTypeStr = 'Repository';
const currentStatusFn = addEditStatusText(componentTypeStr);
const addEditButtonTextFn = addEditButtonText(componentTypeStr);

const InnerS3Form: React.FunctionComponent<IOtherProps & FormikProps<IFormValues>> = ({
  addEditStatus: currentStatus,
  checkConnection,
  values,
  touched,
  errors,
  handleChange,
  setFieldTouched,
  setFieldValue,
  onClose,
  handleSubmit,
  handleBlur,
  isAWS,
}: IOtherProps & FormikProps<IFormValues>) => {
  const nameKey = 'name';
  const s3UrlKey = 's3Url';
  const awsBucketNameKey = 'awsBucketName';
  const awsBucketRegionKey = 'awsBucketRegion';
  const accessKeyKey = 'accessKey';
  const secretKey = 'secret';
  const requireSSLKey = 'requireSSL';
  const caBundleKey = 'caBundle';

  const [isAccessKeyHidden, setIsAccessKeyHidden] = useState(true);

  const handleAccessKeyHiddenToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAccessKeyHidden(!isAccessKeyHidden);
  };
  const [isSecretHidden, setIsSecretHidden] = useState(true);
  const handleSecretHiddenToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSecretHidden(!isSecretHidden);
  };

  const formikHandleChange = (_val, e) => handleChange(e);
  const formikSetFieldTouched = (key) => () => setFieldTouched(key, true, true);

  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
      <FormGroup
        label="Replication repository name"
        isRequired
        fieldId={nameKey}
        helperTextInvalid={touched.name && errors.name}
        isValid={!(touched.name && errors.name)}
      >
        {/*
          // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}
        <TextInput
          data-testid="storage-name-input"
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(nameKey)}
          onBlur={handleBlur}
          value={values.name}
          name={nameKey}
          type="text"
          id="storage-name-input"
          isDisabled={currentStatus.mode === AddEditMode.Edit}
          isValid={!(touched.name && errors.name)}
        />
      </FormGroup>
      <FormGroup
        label="S3 bucket name"
        isRequired
        fieldId={awsBucketNameKey}
        helperTextInvalid={touched.awsBucketName && errors.awsBucketName}
        isValid={!(touched.awsBucketName && errors.awsBucketName)}
      >
        {/*
          // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}
        <TextInput
          data-testid="storage-bucket-name-input"
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(awsBucketNameKey)}
          onBlur={handleBlur}
          value={values.awsBucketName}
          name={awsBucketNameKey}
          type="text"
          id="storage-bucket-name-input"
          isValid={!(touched.awsBucketName && errors.awsBucketName)}
        />
      </FormGroup>
      <FormGroup
        label="S3 bucket region"
        fieldId={awsBucketRegionKey}
        helperTextInvalid={touched.awsBucketRegion && errors.awsBucketRegion}
        isValid={!(touched.awsBucketRegion && errors.awsBucketRegion)}
      >
        {/*
          // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}
        <TextInput
          data-testid="storage-bucket-region-input"
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(awsBucketRegionKey)}
          onBlur={handleBlur}
          value={values.awsBucketRegion}
          name={awsBucketRegionKey}
          type="text"
          id="storage-bucket-region-input"
          isValid={!(touched.awsBucketRegion && errors.awsBucketRegion)}
        />
      </FormGroup>
      {!isAWS && (
        <FormGroup
          label="S3 endpoint"
          isRequired
          fieldId={s3UrlKey}
          helperTextInvalid={touched.s3Url && errors.s3Url}
          isValid={!(touched.s3Url && errors.s3Url)}
        >
          {/*
            // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}
          <TextInput
            data-testid="storage-s3-url-input"
            onChange={formikHandleChange}
            onInput={formikSetFieldTouched(s3UrlKey)}
            onBlur={handleBlur}
            value={values.s3Url}
            name={s3UrlKey}
            type="text"
            id="storage-s3-url-input"
            isValid={!(touched.s3Url && errors.s3Url)}
          />
        </FormGroup>
      )}
      <FormGroup
        label="S3 provider access key"
        isRequired
        fieldId={accessKeyKey}
        helperTextInvalid={touched.accessKey && errors.accessKey}
        isValid={!(touched.accessKey && errors.accessKey)}
      >
        <HideWrapper onClick={handleAccessKeyHiddenToggle}>
          <KeyDisplayIcon id="accessKeyIcon" isHidden={isAccessKeyHidden} />
        </HideWrapper>
        {/*
          // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}

        <TextInput
          data-testid="storage-access-key-input"
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(accessKeyKey)}
          onBlur={handleBlur}
          value={values.accessKey}
          name={accessKeyKey}
          type={isAccessKeyHidden ? 'password' : 'text'}
          id="storage-access-key-input"
          isValid={!(touched.accessKey && errors.accessKey)}
        />
      </FormGroup>
      <FormGroup
        label="S3 provider secret access key"
        isRequired
        fieldId={secretKey}
        helperTextInvalid={touched.secret && errors.secret}
        isValid={!(touched.secret && errors.secret)}
      >
        <HideWrapper onClick={handleSecretHiddenToggle}>
          <KeyDisplayIcon id="accessKeyIcon" isHidden={isSecretHidden} />
        </HideWrapper>
        {/*
          // @ts-ignore issue: https://github.com/konveyor/mig-ui/issues/747 */}
        <TextInput
          data-testid="storage-secret-input"
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(secretKey)}
          onBlur={handleBlur}
          value={values.secret}
          name={secretKey}
          type={isSecretHidden ? 'password' : 'text'}
          id="storage-secret-input"
          isValid={!(touched.secret && errors.secret)}
        />
      </FormGroup>
      {!isAWS && (
        <>
          <FormGroup
            fieldId={requireSSLKey}
            helperText={
              <>
                Select 'Require SSL verification' to verify SSL connections to the object store. If
                you are using a self-signed certificate, you may either disable SSL verification, or
                upload your certificate bundle.
              </>
            }
          >
            <Checkbox
              onChange={formikHandleChange}
              onInput={formikSetFieldTouched(requireSSLKey)}
              onBlur={handleBlur}
              isChecked={values.requireSSL}
              name={requireSSLKey}
              label="Require SSL verification"
              id="require-ssl-input"
            />
          </FormGroup>
          {values.requireSSL && (
            <FormGroup label="CA bundle file" fieldId={caBundleKey}>
              <CertificateUpload
                fieldName={caBundleKey}
                value={values[caBundleKey]}
                onChange={(value) => {
                  const encodedValue = btoa(value);
                  setFieldValue(caBundleKey, encodedValue);
                  formikSetFieldTouched(caBundleKey);
                }}
                onInput={formikSetFieldTouched(caBundleKey)}
              />
            </FormGroup>
          )}
        </>
      )}
      <Flex breakpointMods={[{ modifier: FlexModifiers['space-items-md'] }]}>
        <Button
          variant="primary"
          type="submit"
          isDisabled={isAddEditButtonDisabled(currentStatus, errors, touched, true)}
        >
          {addEditButtonTextFn(currentStatus)}
        </Button>
        <Button
          variant="secondary"
          isDisabled={isCheckConnectionButtonDisabled(currentStatus, true)}
          onClick={() => checkConnection(values.name)}
        >
          Check Connection
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Flex>
      <ConnectionStatusLabel status={currentStatus} statusText={currentStatusFn(currentStatus)} />
    </Form>
  );
};

const S3Form: React.ComponentType<IOtherProps> = withFormik<IOtherProps, IFormValues>({
  mapPropsToValues: ({ initialStorageValues, provider, isAWS }) => {
    const values = {
      name: '',
      awsBucketName: '',
      awsBucketRegion: '',
      accessKey: '',
      secret: '',
      s3Url: '',
      bslProvider: provider,
      requireSSL: true,
      caBundle: '',
    };

    if (initialStorageValues) {
      values.name = initialStorageValues.name || '';
      values.awsBucketName = initialStorageValues.awsBucketName || '';
      values.awsBucketRegion = initialStorageValues.awsBucketRegion || '';
      values.accessKey = initialStorageValues.accessKey || '';
      values.secret = initialStorageValues.secret || '';
      values.s3Url = initialStorageValues.s3Url || '';
      values.requireSSL = initialStorageValues.requireSSL || isAWS; // Default to require SSL for AWS
      values.caBundle = initialStorageValues.caBundle || null;
    }

    return values;
  },

  validate: (values: IFormValues, props: IOtherProps) => {
    const errors: any = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (!utils.testDNS1123(values.name)) {
      errors.name = utils.DNS1123Error(values.name);
    }

    if (!values.awsBucketName) {
      errors.awsBucketName = 'Required';
    }

    const awsBucketNameError = storageUtils.testS3Name(values.awsBucketName);
    if (awsBucketNameError !== '') {
      errors.awsBucketName = awsBucketNameError;
    }

    if (!values.awsBucketName) {
      errors.awsBucketName = 'Required';
    }

    if (!props.isAWS && !values.s3Url) {
      errors.s3Url = 'Required';
    }

    if (values.s3Url !== '') {
      const s3UrlError = commonUtils.testURL(values.s3Url)
        ? ''
        : 'S3 Endpoint must be a valid URL.';
      if (s3UrlError !== '') {
        errors.s3Url = s3UrlError;
      }
    }

    if (!values.accessKey) {
      errors.accessKey = 'Required';
    }

    if (!values.secret) {
      errors.secret = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, formikBag: any) => {
    // Formik will set isSubmitting to true, so we need to flip this back off
    formikBag.setSubmitting(false);
    formikBag.props.onAddEditSubmit(values);
  },
})(InnerS3Form);

export default S3Form;
