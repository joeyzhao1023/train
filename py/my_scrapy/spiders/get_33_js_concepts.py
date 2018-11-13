# -*- coding: utf-8 -*-
# __author__ = 'joeyzhao'
from urlparse import urlparse

from scrapy import Spider, Selector, Request

from ..items import Get33JsConceptsItem


class Get33JsConceptsSpider(Spider):
    name = "get_33_js_concepts"
    allowed_domains = ["github.com"]
    start_urls = [
        # "https://github.com/leonardomso/33-js-concepts"
        "https://github.com/stephentian/33-js-concepts"
    ]
    link_urls = []
    loaded_urls = []

    @staticmethod
    def create_article(module_name, class_name, *args, **kwargs):
        module_meta = __import__(module_name, globals(), locals(), [class_name])
        class_meta = getattr(module_meta, class_name)
        obj = None
        if class_meta:
            obj = class_meta(*args, **kwargs)
        return obj

    def parse(self, response):
        sel = Selector(response)
        if str(response.url) in self.start_urls:
            for s in sel.xpath('//ul'):
                self.link_urls.extend(s.xpath('//a/@href').extract())
            self.link_urls = list(set(self.link_urls))
        else:
            item = Get33JsConceptsItem()
            link = str(response.url)
            the_domain = ''.join([item for item in urlparse(link).netloc.split('.')])

            # init by class dynamic
            article = self.create_article('article', the_domain.upper() + 'Article')
            if not article:
                return

            item['title'] = sel.xpath(article.title_xpath).extract()
            item['content'] = sel.xpath(article.content_xpath).extract()
            item['date'] = sel.xpath(article.date_xpath).extract()
            item['link'] = link
            self.loaded_urls.append(str(response.url))
            yield item

        for url in self.link_urls:
            yield Request(url, callback=self.parse)
