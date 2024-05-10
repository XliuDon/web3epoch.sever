import * as yup from 'yup';

export interface CategoryWithImageSchema {
  cate_data: object;
}

export interface CategorySchema {
  categoryImgUrl: string|undefined,
  categoryName: string;
  categoryCode: string;
}

export interface GetCategorySchema {
  categoryCode: string;
}

export interface DeleteCategorySchema {
  categoryCode: string;
}


export const categoryWithImageSchema: yup.SchemaOf<CategoryWithImageSchema> = yup.object().shape({
    cate_data: yup
    .object()
    .required({ message: 'Category data is required.' }),
});

export const categorySchema: yup.SchemaOf<CategorySchema> = yup.object().shape({
  categoryImgUrl: yup
    .string(),
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

export const deleteCategorySchema: yup.SchemaOf<DeleteCategorySchema> = yup.object().shape({
  categoryCode: yup
    .string()
    .required({ message: 'categoryCode is required.' }),     
});


export default categorySchema;
