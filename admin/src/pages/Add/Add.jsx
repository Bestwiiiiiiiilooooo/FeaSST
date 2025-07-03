import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLanguage } from '../../LanguageContext';

const Add = () => {
    const { t } = useLanguage();

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Store 1",
        promoCode: "",
        promoDiscount: ""
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);
        formData.append("promoCode", data.promoCode);
        formData.append("promoDiscount", data.promoDiscount);
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                description: "",
                price: "",
                category: data.category,
                promoCode: "",
                promoDiscount: ""
            })
            setImage(false);
        }
        else {
            toast.error(response.data.message)
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>{t('uploadImage') || 'Upload image'}</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>{t('productName') || 'Product name'}</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder={t('typeHere') || 'Type here'} required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>{t('productDescription') || 'Product description'}</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder={t('writeContentHere') || 'Write content here'} required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>{t('storeNumber') || 'Store number'}</p>
                        <select name='category' onChange={onChangeHandler} >
                            <option value="Store 1">Store 1</option>
                            <option value="Store 2">Store 2</option>
                            <option value="Store 3">Store 3</option>
                            <option value="Store 4">Store 4</option>
                            <option value="Store 5">Store 5</option>
                            <option value="Store 6">Store 6</option>
                            <option value="Store 7">Store 7</option>
                            <option value="Store 8">Store 8</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>{t('productPrice') || 'Product Price'}</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder={t('pricePlaceholder') || '25'} />
                    </div>
                </div>
                <div className='add-promo flex-col'>
                    <p>{t('promoCodeLabel') || 'Promo Code (optional)'}</p>
                    <input name='promoCode' onChange={onChangeHandler} value={data.promoCode} type="text" placeholder={t('promoCodePlaceholder') || 'e.g. SAVE10'} />
                </div>
                <div className='add-promo-discount flex-col'>
                    <p>{t('promoDiscountLabel') || 'Promo Discount (%) (optional)'}</p>
                    <input name='promoDiscount' onChange={onChangeHandler} value={data.promoDiscount} type="number" min="0" max="100" placeholder={t('promoDiscountPlaceholder') || 'e.g. 10'} />
                </div>
                <button type='submit' className='add-btn' >{t('addItem')}</button>
            </form>
        </div>
    )
}

export default Add
