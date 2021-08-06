import React, { useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
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
     LogoutButton,
     LoadContainer
 } from './styles';


 export interface DataListProps extends TransactionsCardProps {
     id: string;
 }

 interface HighlightProps {
     amount: string;
 }

 interface HighlightData {
     entries: HighlightProps;
     outs: HighlightProps;
     total: HighlightProps;
 }

export function Dashboard(){
    const [ transactions, setTransactions ] = useState<DataListProps[]>([]);
    const [ highlightData, setHighlightData ] = useState<HighlightData>({} as HighlightData);
    const [ isLoading, setIsLoading ] =useState(true);

    const theme = useTheme();

    async function loadTransactions() {

        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let outsTotal = 0;

        const transactionsFormateed: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                outsTotal += Number(item.amount);
            }

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

        setTransactions(transactionsFormateed);

        const total = entriesTotal - outsTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            outs: {
                amount: outsTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {  
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
         
        });

        //console.log(transactionsFormateed);
        setIsLoading(false);

    }

    useEffect(() => {
    
        loadTransactions();

    }, [])

    useFocusEffect(useCallback(() => {
       loadTransactions();
    }, []));

    return (
        <Container>
            
            
            {
                isLoading ? <LoadContainer><ActivityIndicator color={theme.colors.primary} size="large" /></LoadContainer> : 
            <>
            
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
                <HighlightCard type="up" title="Entrada" amount={highlightData.entries.amount} lastTransaction="Última entrada dia 13 de abril"/>
                <HighlightCard type="down" title="Saídas" amount={highlightData.outs.amount} lastTransaction="Última saída dia 03 de abril" />
                <HighlightCard type="total"  title="Total" amount={highlightData.total.amount} lastTransaction="01 à 16 de abril" />
         </HighlightCards>
 
        <Transactions>
            <Title>Listagem</Title>

            <TransactionList
            
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            
            />

        </Transactions>

         </>
         }
        </Container>
    );
}

