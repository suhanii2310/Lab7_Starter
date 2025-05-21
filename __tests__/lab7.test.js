

describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    expect(numProducts).toBe(20);
  });

  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    let allArePopulated = true;

    const prodItemsData = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map(item => {
        const data = item.data;
        return {
          title: data.title,
          price: data.price,
          image: data.image
        };
      });
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const product = prodItemsData[i];
      if (!product.title || !product.price || !product.image) {
        allArePopulated = false;
        break;
      }
    }

    expect(allArePopulated).toBe(true);
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    await button.click();
    const innerText = await button.getProperty('innerText');
    const value = await innerText.jsonValue();
    expect(value).toBe('Remove from Cart');
  }, 2500);

  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const productItems = await page.$$('product-item');

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const text = await innerText.jsonValue();
      if (text === 'Add to Cart') {
        await button.click();
        await new Promise(r => setTimeout(r, 100));
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 15000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const productItems = await page.$$('product-item');

    let allButtonsCorrect = true;

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const text = await innerText.jsonValue();
      if (text !== 'Remove from Cart') {
        allButtonsCorrect = false;
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
    expect(allButtonsCorrect).toBe(true);
  }, 15000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Removing all items from cart...');
    const productItems = await page.$$('product-item');

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const text = await innerText.jsonValue();
      if (text === 'Remove from Cart') {
        await button.click();
        await new Promise(r => setTimeout(r, 100));
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 15000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Reloading and checking cart count again...');
    await page.reload();
    const productItems = await page.$$('product-item');

    let allButtonsCorrect = true;

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const text = await innerText.jsonValue();
      if (text !== 'Add to Cart') {
        allButtonsCorrect = false;
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
    expect(allButtonsCorrect).toBe(true);
  }, 15000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});

