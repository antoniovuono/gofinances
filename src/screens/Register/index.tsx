import React, {useState} from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";

import * as Yup from "yup";
import { Resolver, yupResolver } from "@hookform/resolvers/yup"

import { useForm } from "react-hook-form";
import { InputForm } from "../../components/Form/InputForm";
import { Input } from "../../components/Form/Input";
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

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect( type: 'up' | 'down' ) {
        setTransactionType(type);
    };

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleRegister(form: FormData) {

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
        

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }


        console.log(data);
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
                        onPress={ () => handleTransactionTypeSelect('up') }
                        isActive={ transactionType === 'up'}
                    />
                    
                    <TransactionTypeButton
                         type="down" 
                         title="Outcome"
                         onPress={ () => handleTransactionTypeSelect('down') }
                         isActive={ transactionType === 'down'}
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