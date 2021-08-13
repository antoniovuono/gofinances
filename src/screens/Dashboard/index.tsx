import React, { useCallback,useEffect, useState  } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";
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
     lasTransaction: string;
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
    const { signOut, user } = useAuth();


    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
        ) {
        
        const collectionFiltered =  collection.filter(transaction => transaction.type === type);

        if(collectionFiltered.length === 0)
        return 0;
       

        const lastTransaction = new Date(
        Math.max.apply(Math, collectionFiltered
        .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;

    }

    async function loadTransactions() {

        const dataKey = `@gofinances:transactions_user:${user.id}`;
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

       const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
       const lastTransactionOuts = getLastTransactionDate(transactions, 'negative');
       const totalInterval = lastTransactionOuts === 0 ? 'Não há transações' : `01 a ${lastTransactionOuts}`;
    
 

        const total = entriesTotal - outsTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: lastTransactionEntries === 0 ? 'Não há transações' :`Última entrada ${lastTransactionEntries}`,
            },
            outs: {
                amount: outsTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: lastTransactionOuts === 0 ? 'Não há transações' : `Última saída ${lastTransactionOuts}`,
            },
            total: {  
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: totalInterval
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
                        <Photo source={{uri: user.photo }}/>
                        <User>
                            <UserGrettings>Olá,</UserGrettings>
                            <UserName>{user.name}</UserName>
                        </User>
                    </UserInfo>


                    <LogoutButton onPress={signOut}>
                        <Icon name="power" />
                    </LogoutButton>

                </UserWrapper>
            </Header>
       
         <HighlightCards>
                <HighlightCard type="up" title="Entrada" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lasTransaction}/>
                <HighlightCard type="down" title="Saídas" amount={highlightData.outs.amount} lastTransaction={highlightData.outs.lasTransaction} />
                <HighlightCard type="total"  title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lasTransaction} />
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

