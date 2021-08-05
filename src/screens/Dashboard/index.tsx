import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionsCardProps } from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";

import {
     Container,
     Header,
     UserWrapper,
     UserInfo,
     Photo,
     User,
     UserGrettings,
     UserName,
     Icon,
     HighlightCards,
     Transactions,
     Title,
     TransactionList,
     LogoutButton
 } from './styles';

 export interface DataListProps extends TransactionsCardProps {
     id: string;
 }

export function Dashboard(){
    const [ data, setData ] = useState<DataListProps[]>([]);

    async function loadTransactions() {

        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        const transactionsFormateed: DataListProps[] = transactions
        .map((item: DataListProps) => {
            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount, 
                type: item.type,
                category: item.category,
                date
            }
        });

        setData(transactionsFormateed);
    }

    useEffect(() => {
    
        loadTransactions();


    }, [])

    useFocusEffect(useCallback(() => {
       loadTransactions();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/7297243?s=400&v=4'}}/>
                        <User>
                            <UserGrettings>Olá,</UserGrettings>
                            <UserName>Antonio</UserName>
                        </User>
                    </UserInfo>


                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>

                </UserWrapper>
            </Header>
       
         <HighlightCards>
                <HighlightCard type="up" title="Entrada" amount="R$ 17.400,00" lastTransaction="Última entrada dia 13 de abril"/>
                <HighlightCard type="down" title="Saídas" amount="R$ 1.259,00" lastTransaction="Última saída dia 03 de abril" />
                <HighlightCard type="total"  title="Total" amount="R$ 16.141,00" lastTransaction="01 à 16 de abril" />
         </HighlightCards>
 
        <Transactions>
            <Title>Listagem</Title>

            <TransactionList
            
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            
            />

        </Transactions>
        

        </Container>
    );
}

