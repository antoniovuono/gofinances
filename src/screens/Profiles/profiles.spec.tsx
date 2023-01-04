// render utilizamos pra renderizar o app para ser testado.
import { render } from '@testing-library/react-native';
import Profiles from './';

// Criamos um test suite 
describe('Profiles', () => {
  it('Should be able to render a title label', () => {
	// Seletores: usamos o getByTestId
    const { getByTestId } = render(<Profiles />);

    const title = getByTestId('text-title');
		
	// Recuperamos da prop children o label do Text
    expect(title.props.children).toContain('Perfil');
  });

  it('Should be able to render a placeholder for username input', () => {
	// Usamos o GetplaceholderText pra recuperar o placeholder do input
    const { getByPlaceholderText } = render(<Profiles />);

    const inputName = getByPlaceholderText('Nome');
		
	// Acessamos a props placeholder do input e esperamos que seja verdadeira.
    expect(inputName.props.placeholder).toBeTruthy();
  });

  it('Should be able to render a placeholder for surname input', () => {
	// Usamos o GetplaceholderText pra recuperar o placeholder do input
    const { getByPlaceholderText } = render(<Profiles />);

    const surname = getByPlaceholderText('Sobrenome');


	// Acessamos a props placeholder do input e esperamos que seja verdadeira.
    expect(surname.props.placeholder).toBeTruthy();
  });

  it('Shold be able render a correctly data', () => {
// Aplicamos um seleter no componente para identificar
    const { getByTestId } = render(<Profiles />);

    const inputName = getByTestId('input-name');
    const surname = getByTestId('input-surname');
	

// Esperamos que o valor da propriedade seja a definida pelo toEqual.
    expect(inputName.props.value).toEqual('Antonio');
    expect(surname.props.value).toEqual('Vuono');
  });
});