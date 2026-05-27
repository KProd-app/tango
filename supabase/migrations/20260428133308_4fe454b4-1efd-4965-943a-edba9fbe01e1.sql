UPDATE menu_categories SET sort_order = 99 WHERE slug = 'picu-rinkiniai-kepimui-namuose';
UPDATE menu_categories SET sort_order = sort_order - 1 WHERE sort_order BETWEEN 4 AND 13;
UPDATE menu_categories SET sort_order = 13 WHERE slug = 'picu-rinkiniai-kepimui-namuose';