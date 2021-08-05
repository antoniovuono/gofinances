import React, {useState} from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"

import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
 } from "./styles";

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatóro'),
    amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo')
});


export function  Register() {
    const [ transactionType, setTransactionType ] = useState('');
    const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);


    const [ category, setCategory ] = useState({
        key: 'category',
        name: 'Categoria',
       
    });

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect( type: 'positive' | 'negative' ) {
        setTransactionType(type);
    };

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {

        if(!transactionType) 
            return Alert.alert(
                'Tipo não identificado',
                'Defina o tipo da transação'
            );

        if(category.key === 'category')
        return Alert.alert(
            'Categoria não selecionada',
            'Selecione a categoria da transação'
        )
        

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }


        try {
        
        const dataKey = '@gofinances:transactions';
        const data = await AsyncStorage.getItem(dataKey);
        const currentData = data ? JSON.parse(data) : [];

        const dataFormated = [
            ...currentData,
            newTransaction
        ]
        
        await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

        reset();
        setTransactionType('');
        setCategory({
            key: 'category',
            name: 'Categoria',
           
        });

        navigation.navigate('Listagem');

        } catch(error) {

            console.log(error)

            Alert.alert('Não foi possível salvar a transação')
        }

    }


    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm
                        placeholder="Nome" 
                        autoCapitalize="sentences"
                        autoCorrect={false}
                        control={control}
                        name="name"
                        error={errors.name && errors.name.message}
                    
                    />

                    <InputForm 
                        placeholder="Preço"
                        keyboardType="numeric"
                        control={control}
                        name="amount"
                        error={errors.amount && errors.amount.message}
                    />

                <TransactionsTypes>
                    <TransactionTypeButton 
                        type="up"
                        title="Income"
                        onPress={ () => handleTransactionTypeSelect('positive') }
                        isActive={ transactionType === 'positive'}
                    />
                    
                    <TransactionTypeButton
                         type="down" 
                         title="Outcome"
                         onPress={ () => handleTransactionTypeSelect('negative') }
                         isActive={ transactionType === 'negative'}
                    />
                </TransactionsTypes>

                <CategorySelectButton 
                    title={category.name}
                    onPress={handleOpenSelectCategoryModal}
                 />
                    
                </Fields>

                    <Button 
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                       
                    />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>

        </TouchableWithoutFeedback>
    );
}