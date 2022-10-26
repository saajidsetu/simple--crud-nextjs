
import * as Yup from 'yup';

export interface iReceipt {
    rate: string;
   v_number: string;
    date: string;
    check: boolean;
}

export const initialReceipt: iReceipt = {
    rate: '',
    v_number: '',
    date: '',
    check: false,
    
};

export const createReceiptSchema = Yup.object().shape({
    rate: Yup.string().optional(),
    v_name: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    date: Yup.string().optional(),
    check: Yup.boolean().optional(),
});

export const updateReceiptSchema = Yup.object().shape({
    rate: Yup.string().optional(),
    v_name: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    date: Yup.string().optional(),
    check: Yup.boolean().optional(),
});

const receiptsValidator = { initialReceipt, createReceiptSchema, updateReceiptSchema };
export default receiptsValidator;
