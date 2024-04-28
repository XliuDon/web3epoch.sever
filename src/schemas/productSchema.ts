import * as yup from 'yup';

export interface ProductSchema {
  id: string | undefined,
  productName: string,
  price: number;
  categoryCode: string;
  description: string;
}

export interface GetProductSchema {
  id: string;
}

export interface DeleteProductSchema {
  id: string;
}

export const productSchema: yup.SchemaOf<ProductSchema> = yup.object().shape({
  productName: yup
    .string()
    .required({ message: 'Product name is required.' }),
    description: yup
    .string()
    .required({ message: 'product description is required.' }),
    categoryCode: yup
    .string()
    .required({ message: 'Categrory code is required.' }),
    price: yup
    .number()
    .required({ message: 'Price is required.' }),
    id: yup
    .string()
});

export const editProductSchema: yup.SchemaOf<ProductSchema> = yup.object().shape({
  productName: yup
    .string()
    .required({ message: 'Product name is required.' }),
    description: yup
    .string()
    .required({ message: 'product description is required.' }),
    categoryCode: yup
    .string()
    .required({ message: 'Categrory code is required.' }),
    price: yup
    .number()
    .required({ message: 'Price is required.' }),
    id: yup
    .string()
    .required({ message: 'Product Id is required.' }),
});

export const getProductSchema: yup.SchemaOf<GetProductSchema> = yup.object().shape({
    id: yup
    .string()
    .required({ message: 'product id is required.' }),
});


export const deleteProductSchema: yup.SchemaOf<DeleteProductSchema> = yup.object().shape({
  id: yup
    .string()
    .required({ message: 'Product id is required.' }),     
});
