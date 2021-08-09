import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";

import {  useTheme } from "styled-components";

import { categories } from "../../utils/categories";
import { HistoryCard } from "../../components/HistoryCard";

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer
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
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const outs = responseFormatted
        .filter((out: TransactionData) => out.type === 'negative');

        const outsTotal = outs.reduce((acumulator: number, out: TransactionData) => {
            return acumulator + Number(out.amount);
        }, 0);

        console.log(outsTotal);

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
    }

    useEffect(() => {
        loadData();
    }, []);
 

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>


        <Content>

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



        </Container>
    );
}