# -*- coding: utf-8 -*-
# __author__ = 'joeyzhao'
from abc import ABCMeta, abstractmethod


class Article(metaclass=ABCMeta):
    @abstractmethod
    def __init__(self):
        self.title_xpath = ''
        self.content_xpath = ''
        self.date_xpath = ''


class JUEJINIMArticle(Article):
    def __init__(self):
        Article.__init__(self)
        self.title_xpath = '//article[@class="article"]/h1[@class="article-title"]'
        self.content_xpath = '//article[@class="article"]/div[@class="article-content"]'
        self.date_xpath = '//article[@class="article"]/time[@class="time"]'
