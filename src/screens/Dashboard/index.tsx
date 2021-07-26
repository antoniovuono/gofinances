import React from "react";
import { HighlightCard } from "../../components/HighlightCard";

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
     HighlightCards
 } from './styles'

export function Dashboard(){
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

                    <Icon name="power" />
                </UserWrapper>
            </Header>
       
         <HighlightCards>
                <HighlightCard />
                <HighlightCard />
                <HighlightCard />
         </HighlightCards>

        </Container>
    );
}

