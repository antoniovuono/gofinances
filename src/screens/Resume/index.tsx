import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {  useTheme } from "styled-components";

import { categories } from "../../utils/categories";
import { HistoryCard } from "../../components/HistoryCard";

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
 } from "./styles";



interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {
    const[isLoading, setIsLoading] = useState(false);
    const[ selectedDate, setSelectedDate ] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    function handleChangeDate(action: 'next' | 'prev') {

        if ( action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const outs = responseFormatted
        .filter((out: TransactionData) =>
         out.type === 'negative' && 
         new Date(out.date).getMonth() === selectedDate.getMonth() &&
         new Date(out.date).getFullYear() === selectedDate.getFullYear()
         );

        const outsTotal = outs.reduce((acumulator: number, out: TransactionData) => {
            return acumulator + Number(out.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            outs.forEach(( out: TransactionData) => {
                if(out.category === category.key) {
                    categorySum += Number(out.amount);
                }
            });

           if(categorySum > 0) {
                const totalFormatted = categorySum
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / outsTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
              }
          });
            setTotalByCategories(totalByCategory);
            setIsLoading(false);
            
    }

    useFocusEffect(useCallback(() => {
        loadData();
     }, [selectedDate]));
 

    return (
        <Container>
            
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            {

            isLoading ? <LoadContainer><ActivityIndicator color={theme.colors.primary} size="large" /></LoadContainer> : 

           

        <Content

            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight(),

            }}    
        >

        <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
                <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
                { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate('next')}>
                <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>

        </MonthSelect>

         <ChartContainer>
                <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map( category => category.color)}
                        style={{
                            labels: { 
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                             }
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"
                        
                    />
         </ChartContainer>


           {
             totalByCategories.map(item => (
                <HistoryCard 
                key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
                    />
             ))
           }

        </Content>
          
       
        }



        </Container>
    );
}