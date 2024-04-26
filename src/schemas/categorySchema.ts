import * as yup from 'yup';

export interface CategorySchema {
  categoryImgUrl: string,
  categoryName: string;
  categoryCode: string;
}

export interface GetCategorySchema {
  categoryCode: string;
}

const categorySchema: yup.SchemaOf<CategorySchema> = yup.object().shape({
  categoryImgUrl: yup
    .string()
    .required({ message: 'Image Url is required.' }),
    categoryName: yup
    .string()
    .required({ message: 'Category name is required.' }),
    categoryCode: yup
    .string()
    .required({ message: 'Category code is required.' }),
});

export const getCategorySchema: yup.SchemaOf<GetCategorySchema> = yup.object().shape({
    categoryCode: yup
    .string()
    .required({ message: 'Category code is required.' }),
});

export default categorySchema;
