package com.lanchonete.dianaburgers_web.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/***
 * Classe de configuração que inicializará o ModelMapper e o disponibilizará como um Bean
 * no contexto da nossa aplicação.
 */
@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}